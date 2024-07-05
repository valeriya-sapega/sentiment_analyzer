import { useEffect, useRef, useState } from 'react';
import './App.css';

enum Sentiment {
    Negative = 1,
    Neutral = 2,
    Positive = 3,
}

interface SentimentColorMap {
    [key: number]: string[];
}

interface SentimentLabelMap {
    [key: number]: string;
}

const sentimentColorMap: SentimentColorMap = {
    [Sentiment.Negative]: ['#7a2222', '#cc5757', '#f9c7c7'],
    [Sentiment.Neutral]: ['#ffd819', '#ffe97f', '#fffae5'],
    [Sentiment.Positive]: ['#22577a', '#57cc99', '#c7f9cc'],
};

const sentimentLabelMap: SentimentLabelMap = {
    [Sentiment.Negative]: 'Negative',
    [Sentiment.Neutral]: 'Neutral',
    [Sentiment.Positive]: 'Positive',
};

function App() {
    const [sentiment, setSentiment] = useState<Sentiment>(Sentiment.Neutral);
    const [sentimentScore, setSentimentScore] = useState<number | null>(null);
    const [showSentiment, setShowSentiment] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!ref.current) return;

        const [colorA, colorB, colorC] = sentimentColorMap[sentiment];

        ref.current.style.setProperty('--color-a', colorA);
        ref.current.style.setProperty('--color-b', colorB);
        ref.current.style.setProperty('--color-c', colorC);
    }, [sentiment]);

    const getEmoji = (sentiment: Sentiment) => {
        switch (sentiment) {
            case Sentiment.Negative:
                return '😡';
                break;
            case Sentiment.Neutral:
                return '😐';
                break;
            case Sentiment.Positive:
                return '😊';
                break;
            default:
                return '😐';
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);
        postFormData(formData, event.currentTarget.method);
    };

    const handleReset = (event: React.FormEvent<HTMLFormElement>) => {
        const form = event.target as HTMLFormElement;
        form.reset();
        setSentiment(Sentiment.Neutral);
        setSentimentScore(null);
        setShowSentiment(false);
        setError(null);
    };

    const postFormData = async (formData: FormData, method: string) => {
        try {
            const response = await fetch('http://localhost:3001/content', {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(Object.fromEntries(formData)),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            setSentiment(data.sentiment_label);
            setSentimentScore(data.sentiment_score.toFixed(2));
            setShowSentiment(true);
            setError(null);
        } catch (error) {
            console.error(error);
            setError('Error. No word provided.');
        }
    };

    return (
        <div className='container' ref={ref}>
            <div className='wrapper'>
                <form
                    method='POST'
                    onSubmit={handleSubmit}
                    onReset={handleReset}
                >
                    <textarea
                        className='textarea'
                        placeholder='Enter a text you want to analyze...'
                        id='content'
                        name='content'
                    ></textarea>
                    <div className='btn_container'>
                        <button className='btn' type='reset'>
                            Clear
                        </button>
                        <button className='btn' type='submit'>
                            Analyze
                        </button>
                    </div>
                </form>
                <div className='sentiment_wrapper'>
                    {showSentiment && (
                        <>
                            <div className='result'>
                                {sentimentLabelMap[sentiment]}
                            </div>
                            <div className='result'>{sentimentScore}</div>
                            <div className='result'>{getEmoji(sentiment)}</div>
                        </>
                    )}
                </div>
                {error && <div className='error'>{error}</div>}
            </div>
        </div>
    );
}

export default App;
