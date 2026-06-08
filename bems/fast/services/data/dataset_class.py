import logging
from torch.utils.data import Dataset
import torch

logger = logging.getLogger(__name__)


class PowerDataset(Dataset):

    def __init__(self, data, window_size):
        self.data = data
        self.window_size = window_size

        logger.info(f"PowerDataset initialized with data length={len(data)}, window_size={window_size}")

    def __len__(self):
        return len(self.data) - self.window_size

    def __getitem__(self, idx):

        x = self.data[idx:idx + self.window_size]
        y = self.data[idx + self.window_size]

        return torch.tensor(x, dtype=torch.float32), torch.tensor(y, dtype=torch.float32)
