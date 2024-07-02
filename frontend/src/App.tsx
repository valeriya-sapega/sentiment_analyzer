import { useState } from 'react';
import './App.css';

function App() {
    const [result, setResult] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);

        const formJson = Object.fromEntries(formData.entries());
        console.log(formJson);

        try {
            const response = await fetch('http://localhost:3001/content', {
                method: form.method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formJson),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setResult(`Sentiment: ${data.sentiment_label}`);
        } catch (error) {
            console.error('Got an eror:', error);
            setError('Failed to fetch results.');
        }
    };

    const handleReset = (event: React.FormEvent<HTMLFormElement>) => {
        const form = event.target as HTMLFormElement;
        form.reset();
    };

    return (
        <div>
            <form method='POST' onSubmit={handleSubmit} onReset={handleReset}>
                <textarea
                    className='textarea'
                    placeholder='Enter a text you want to analyze...'
                    id='content'
                    name='content'
                    rows={10}
                    cols={50}
                ></textarea>
                <button className='btn' type='reset'>
                    Clear
                </button>
                <button className='btn' type='submit'>
                    Analyze
                </button>
            </form>
            {result && <div className='result'>{result}</div>}
            {error && <div className='error'>{error}</div>}
        </div>
    );
}

export default App;
