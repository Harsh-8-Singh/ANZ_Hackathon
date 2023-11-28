import axios from 'axios';

export const fetchResponseFromHuggingFace = async (message) => {
    try {
        const response = await axios.post(
            'https://api-inference.huggingface.co/models/EleutherAI/gpt-j-6B',
            {
                inputs: message,
            },
            {
                headers: {
                    'Authorization': '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'
                }
            }
        );

        return response.data[0].generated_text;
    } catch (error) {
        console.error('Error fetching response from Hugging Face:', error);
        return null;
    }
};
