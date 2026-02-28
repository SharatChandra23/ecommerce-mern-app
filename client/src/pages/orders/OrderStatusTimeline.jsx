import { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa";

function OrderStatusTimeline({ status }) {

  const steps = ["Paid", "Pending", "Shipped", "Delivered"];
  const activeIndex = steps.indexOf(status);

  const [progressWidth, setProgressWidth] = useState("0%");

  useEffect(() => {
    const percent =
      status === "Cancelled"
        ? 0
        : (activeIndex / (steps.length - 1)) * 100;

    setTimeout(() => {
      setProgressWidth(`${percent}%`);
    }, 100);
  }, [activeIndex, status]);

  if (status === "Cancelled") {
    return (
      <div className="mt-6 text-center text-red-600 font-semibold">
        Order Cancelled
      </div>
    );
  }

  return (
    <div className="w-full mt-6">

      <div className="relative">

        {/* Base Line */}
        <div className="absolute top-4 left-0 right-0 h-[3px] bg-gray-200 rounded-full" />

        {/* Active Line */}
        <div
          className="absolute top-4 left-0 h-[3px] bg-green-500 rounded-full transition-all duration-700 ease-in-out"
          style={{ width: progressWidth }}
        />

        {/* Steps */}
        <div className="relative flex justify-between items-center">

          {steps.map((step, index) => {
            const isCompleted = index < activeIndex;
            const isCurrent = index === activeIndex;

            return (
              <div
                key={step}
                className="flex flex-col items-center flex-1"
              >

                <div
                  className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-semibold transition-all duration-300
                    ${isCompleted
                      ? "bg-green-500 text-white"
                      : isCurrent
                        ? "bg-green-500 text-white animate-pulse"
                        : "bg-gray-300 text-gray-600"
                    }
                  `}
                >
                  {isCompleted ? <FaCheck size={10} /> : index + 1}
                </div>

                <p
                  className={`text-xs mt-2 font-medium
                    ${index <= activeIndex
                      ? "text-green-600"
                      : "text-gray-500"
                    }
                  `}
                >
                  {step}
                </p>

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default OrderStatusTimeline;