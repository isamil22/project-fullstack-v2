import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { confirmEmail } from '../api/apiService.js'; // You'll create this next

const EmailConfirmationPage = () => {
    const [email, setEmail] = useState('');
    const [confirmationCode, setConfirmationCode] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const history = useHistory();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            await confirmEmail({ email, confirmationCode });
            setSuccess('Email confirmed successfully! You will be redirected to the login page.');
            setTimeout(() => {
                history.push('/auth');
            }, 3000);
        } catch (err) {
            setError('Invalid email or confirmation code. Please try again.');
        }
    };

    return (
        <div className="container mx-auto mt-10">
            <div className="max-w-md mx-auto bg-white p-8 border border-gray-300 rounded-lg">
                <h2 className="text-2xl font-bold text-center mb-6">Confirm Your Email</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmationCode">
                            Confirmation Code
                        </label>
                        <input
                            type="text"
                            id="confirmationCode"
                            value={confirmationCode}
                            onChange={(e) => setConfirmationCode(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Confirm Email
                        </button>
                    </div>
                    {error && <p className="text-red-500 text-xs italic mt-4">{error}</p>}
                    {success && <p className="text-green-500 text-xs italic mt-4">{success}</p>}
                </form>
            </div>
        </div>
    );
};

export default EmailConfirmationPage;