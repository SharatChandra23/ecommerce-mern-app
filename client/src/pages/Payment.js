function Payment() {
    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-xl shadow-md text-center">
                <h2 className="text-2xl font-bold mb-4">
                    Fake Payment Page
                </h2>
                <p>This is a placeholder payment screen.</p>
                <button className="mt-6 bg-slate-900 text-white px-6 py-2 rounded-md">
                    Pay Now
                </button>
            </div>
        </div>
    );
}

export default Payment;