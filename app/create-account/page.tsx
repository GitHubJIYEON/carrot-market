import Link from "next/link";

export default function CreateAccount() {
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
            <div>
                <Link href="/sms">
                    <span>icon</span>
                    <span>Sign up with SMS</span>
                </Link>
            </div>
        </div>
    );
}
