def generate_report(missing, bias, drift):
    return {
        "missingness": missing.to_dict(),
        "bias": bias,
        "drift": drift
    }
