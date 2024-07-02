import { analyzeSentiment } from '../utils/analyzeSentiment';
import { Request, Response } from 'express';

export const handleContent = async (req: Request, res: Response) => {
    const { content } = req.body;
    if (!content) {
        return res.status(400).json({ error: 'Text is required' });
    }

    try {
        const result = analyzeSentiment(content);
        res.status(200).json({
            message: 'Data received',
            sentiment_score: result.analysisScore,
            sentiment_label: result.analysisLable,
        });
    } catch (error) {
        res.status(500).json({ error });
    }
};
