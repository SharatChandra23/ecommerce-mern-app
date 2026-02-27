const steps = ["Pending", "Paid", "Shipped", "Delivered"];

export function OrderTimeline({ status }) {
  const currentIndex = steps.indexOf(status);

  return (
    <div className="flex justify-between items-center mt-4">
      {steps.map((step, index) => (
        <div key={step} className="flex-1 text-center">
          <div
            className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-white
              ${index <= currentIndex ? "bg-green-600" : "bg-gray-300"}
            `}
          >
            {index + 1}
          </div>
          <p className="text-sm mt-2">{step}</p>
        </div>
      ))}
    </div>
  );
}