import torch
import torch.nn as nn
import logging

logger = logging.getLogger(__name__)

class LSTMModel(nn.Module):
    """
    LSTM 기반 예측 모델 클래스.
    LSTM_CONFIG를 통해 모델 구조 파라미터를 설정.
    """

    def __init__(self, input_size=1, hidden_size=50, num_layers=2, output_size=1, dropout=0.2):  # LSTM 전체 모델 정의
        super(LSTMModel, self).__init__()
        self.hidden_size = hidden_size
        self.num_layers = num_layers
        self.dropout = nn.Dropout(dropout)

        self.lstm = nn.LSTM(input_size, hidden_size, num_layers, batch_first=True, dropout=dropout)
        self.fc = nn.Linear(hidden_size, output_size)

        # 가중치 초기화 메서드 호출
        self._initialize_weights()

        logger.info(f"LSTMModel initialized with: input_size={input_size}, hidden_size={hidden_size}, "
                    f"num_layers={num_layers}, output_size={output_size}, dropout={dropout}")

    def _initialize_weights(self):
        # 가중치 초기화 로직
        for name, param in self.lstm.named_parameters():
            if 'weight' in name:  # weight_ih -> weight
                nn.init.xavier_uniform_(param.data)
            elif 'bias' in name:
                nn.init.zeros_(param.data)

        nn.init.xavier_uniform_(self.fc.weight)
        nn.init.zeros_(self.fc.bias)

        logger.debug("Model weights initialized.")

    def forward(self, x):
        """
        입력 x: (batch_size, seq_length, input_size)
        출력: (batch_size, output_size)
        """
        batch_size = x.size(0)
        h0 = torch.zeros(self.num_layers, x.size(0), self.hidden_size).to(x.device)
        c0 = torch.zeros(self.num_layers, x.size(0), self.hidden_size).to(x.device)

        out, _ = self.lstm(x, (h0, c0))
        out = self.fc(self.dropout(out[:, -1, :]))

        out = torch.sigmoid(out)
        logger.debug(f"Forward pass: input_shape={x.shape}, output_shape={out.shape}")

        return out
