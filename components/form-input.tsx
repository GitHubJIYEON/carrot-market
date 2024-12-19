interface FormInputProps {
    type: string;
    plceholder: string;
    required: boolean;
    error: string[];
}
export default function FormInput({ type, plceholder, required, error }: FormInputProps) {
    return (
        <div className="flex flex-col gap-10">
            <div>
                <h1>안녕하세요</h1>
                <h2>Fill in the from below to join!</h2>
            </div>
            <form action="">
                <input type="text" placeholder="Username" />
                <span>Input error</span>
                <button>Create account</button>
            </form>
            <div />
        </div>
    );
}
