import matplotlib.pyplot as plt

def visualize_line(predictions=None, actuals=None):
    if predictions is None and actuals is None:
        raise ValueError("At least one of predictions or actuals must be provided.")

    plt.figure(figsize=(12, 6))

    if predictions is not None and actuals is not None:
        if len(predictions) != len(actuals):
            raise ValueError("Predictions and actuals must have the same length.")

        plt.plot(predictions, label="Predictions", linestyle='--', marker='o')
        plt.plot(actuals, label="Actuals", linestyle='-', marker='x')
        plt.title("Predictions vs Actuals")

    elif predictions is not None:
        plt.plot(predictions, label="Predictions", linestyle='--', marker='o')
        plt.title("Predictions Only")

    elif actuals is not None:
        plt.plot(actuals, label="Actuals", linestyle='-', marker='x')
        plt.title("Actuals Only")

    plt.xlabel("Sample Index")
    plt.ylabel("Value")
    plt.legend()
    plt.grid(True)
    plt.show()
