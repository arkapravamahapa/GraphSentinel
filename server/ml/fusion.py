from ml.gnn_model import analyze_graph_topology
from ml.cnn_model import analyze_temporal_patterns

def calculate_threat_score(transactions: list[dict]) -> dict:
    """
    Fuses the GNN structural score and CNN temporal score.
    Returns a dictionary containing the final Threat_Score and the Base64 GAF image.
    """
    gnn_score = analyze_graph_topology(transactions)
    cnn_score, gaf_image_base64 = analyze_temporal_patterns(transactions)
    
    # Simple Multilayer Perceptron (MLP) simulation: weighted average
    final_score = (gnn_score * 0.6) + (cnn_score * 0.4)
    
    return {
        "threat_score": round(final_score, 4),
        "gaf_image": gaf_image_base64
    }