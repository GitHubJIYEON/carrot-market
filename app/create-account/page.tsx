"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import SocialLogin from "@/components/social-login";
// import { useFormState } from "react-dom";
import { createAccount } from "./actions";
import { PASSWORD_MIN_LENGTH } from "@/lib/constants";
import { useActionState } from "react";

// 1. 사용자 input 유효성 검사 -> 기존 정보 일치 여부, 비밀번호 일치 확인 -> 

export default function CreateAccount() {
    // const [state, dispatch] = useFormState(createAccount, null);
    const [state, dispatch, isPending] = useActionState(createAccount, null);

    return (
        <div className="flex flex-col gap-10 py-8 px-6">
            <div className="flex flex-col gap-2 *:font-medium">
                <h1 className="text-2xl">안녕하세요!</h1>
                <h2 className="text-xl">Fill in the form below to join!</h2>
            </div>
            <form action={dispatch} className="flex flex-col gap-3">
                <Input
                    name="username"
                    type="text"
                    placeholder="Username"
                    required
                    errors={state?.fieldErrors.username}
                    minLength={3}
                    maxLength={10}
                />
                <Input
                    name="email"
                    type="email"
                    placeholder="Email"
                    required
                    disabled={isPending}
                    errors={state?.fieldErrors.email}
                />
                <Input
                    name="password"
                    type="password"
                    placeholder="Password"
                    required
                    minLength={PASSWORD_MIN_LENGTH}
                    errors={state?.fieldErrors.password}
                />
                <Input
                    name="confirm_password"
                    type="password"
                    placeholder="Confirm Password"
                    required
                    minLength={PASSWORD_MIN_LENGTH}
                />
                <Button text="Create account" />
            </form>
            <SocialLogin />
        </div>
    );
}
