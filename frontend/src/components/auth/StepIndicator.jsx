import { MdCheck } from "react-icons/md";

const StepIndicator = ({
  currentStep,
  totalSteps,
}) => {
  return (
    <div className="flex justify-center mb-8">

      <div className="flex items-center w-full max-w-xs">

        {/* Step 1 */}

        <div
          className={`
            h-10
            w-10
            rounded-full
            flex
            items-center
            justify-center
            font-semibold
            text-sm

            ${
              currentStep > 1
                ? "bg-green-600 text-white"
                : "bg-green-600 text-white"
            }
          `}
        >
          {currentStep > 1 ? <MdCheck size={20} /> : "1"}
        </div>

        {/* Line */}

        <div
          className={`
            flex-1
            h-1

            ${
              currentStep > 1
                ? "bg-green-600"
                : "bg-green-300"
            }
          `}
        />

        {/* Step 2 */}

        <div
          className={`
            h-10
            w-10
            rounded-full
            flex
            items-center
            justify-center
            font-semibold
            text-sm

            ${
              currentStep === totalSteps
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-600"
            }
          `}
        >
          2
        </div>

      </div>

    </div>
  );
};

export default StepIndicator;