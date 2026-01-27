import torch
import torch.nn as nn
import torchvision.models as models

class Encoder(nn.Module):
    def __init__(self, latent_dim=512):
        super(Encoder, self).__init__()
        # Use a pretrained ResNet50 for spatial features
        resnet = models.resnet50(pretrained=True)
        self.feature_extractor = nn.Sequential(*list(resnet.children())[:-1]) # Output: (2048, 1, 1)
        self.fc = nn.Linear(2048, latent_dim)
        self.relu = nn.ReLU()

    def forward(self, x):
        # x shape: (Batch, Sequence, C, H, W)
        batch_size, seq_len, c, h, w = x.size()
        c_in = x.view(batch_size * seq_len, c, h, w)
        features = self.feature_extractor(c_in)
        features = features.view(features.size(0), -1)  # (B*S, 2048)
        latent = self.relu(self.fc(features))  # (B*S, latent_dim)
        return latent.view(batch_size, seq_len, -1), features.view(batch_size, seq_len, -1)

class Decoder(nn.Module):
    def __init__(self, latent_dim=512, feature_dim=2048):
        super(Decoder, self).__init__()
        self.lstm = nn.LSTM(latent_dim, 512, num_layers=2, batch_first=True, bidirectional=True)
        # Reconstruct to ResNet feature space (2048)
        self.fc_out = nn.Linear(1024, feature_dim)
        self.relu = nn.ReLU()

    def forward(self, x):
        output, (hn, cn) = self.lstm(x)
        reconstruction = self.relu(self.fc_out(output))
        return reconstruction

class AnomalyAE(nn.Module):
    def __init__(self):
        super(AnomalyAE, self).__init__()
        self.encoder = Encoder()
        self.decoder = Decoder()

    def forward(self, x):
        latent, features = self.encoder(x)
        recon = self.decoder(latent)
        return recon, features
