import natural from 'natural';
import stopword from 'stopword';
import { standardDict } from './standardDict';

enum Sentiment {
    Negative = 1,
    Neutral = 2,
    Positive = 3,
}

const convertToStandard = (text: string): string => {
    const data = text.split(' ');
    return data
        .map((word) => {
            const key = Object.keys(standardDict).find(
                (key) => standardDict[key] === word
            );
            return key ? standardDict[key] : word;
        })
        .join(' ');
};

const convertToLowerCase = (text: string): string => {
    return text.toLowerCase();
};

const removeNonAlphabetic = (text: string): string => {
    return text.replace(/[^a-zA-Z\s]/g, ' ');
};

const getLevel = (anylisisScore: number) => {
    if (anylisisScore > 0.1) {
        return Sentiment.Positive;
    } else if (anylisisScore < -0.1) {
        return Sentiment.Negative;
    } else {
        return Sentiment.Neutral;
    }
};

// NLP Logic

export const analyzeSentiment = (content: string) => {
    const lexData = convertToStandard(content);
    console.log('Lexical Data', lexData);

    const lowerCaseData = convertToLowerCase(lexData);
    console.log('LowerCase Format: ', lowerCaseData);

    const nonAlphabeticData = removeNonAlphabetic(lowerCaseData);
    console.log('Only Alphabetic: ', nonAlphabeticData);

    const tokenizer = new natural.WordTokenizer();
    const tokenizedData = tokenizer.tokenize(nonAlphabeticData);
    console.log('Tokenized Data : ', tokenizedData);

    const filteredData = stopword.removeStopwords(tokenizedData);
    console.log('Filtered Data : ', filteredData);

    const sentimAnalyzer = new natural.SentimentAnalyzer(
        'English',
        natural.PorterStemmer,
        'afinn'
    );

    const analysisScore = sentimAnalyzer.getSentiment(filteredData);
    const analysisLabel = getLevel(analysisScore);

    const result = {
        analysisScore,
        analysisLabel,
    };
    console.log('Sentiment  Score : ', analysisScore);

    return result;
};
