import { useEffect, useState } from 'react';
import axios from 'axios';

const ViewLiabilities = () => {
    const [liabilities, setLiabilities] = useState([]);

    useEffect(() => {
        // Fetch liabilities data from API
        axios.get('/api/liabilities')
            .then(response => {
                setLiabilities(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the liabilities!', error);
            });
    }, []);

    return (
        <div>
            <h1>Liabilities</h1>
            <ul>
                {liabilities.map((liability, index) => (
                    <li key={index}>
                        <p>Name: {liability.name}</p>
                        <p>Amount: {liability.amount}</p>
                        <p>Due Date: {liability.dueDate}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ViewLiabilities;