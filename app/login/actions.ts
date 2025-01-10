"use server";

import { PASSWORD_MIN_LENGTH, PASSWORD_REGEX, PASSWORD_REGEX_ERROR } from "@/lib/constants";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";
import { z } from "zod";
import bcrypt from "bcrypt";

//사용자 계정 있는지 확인 sort of validation
const checkEmailExists = async (email: string) => {
    const user = await db.user.findUnique({
        where: {
            email,
        },
        select: {
            id: true,
        },
    });

    return Boolean(user);
};
const formSchema = z.object({
    email: z
        .string()
        .email()
        .toLowerCase()
        .refine(checkEmailExists, "An account with this email does not exist."),
    password: z
        .string({
            required_error: "Password is required",
        })
        .min(PASSWORD_MIN_LENGTH)
        .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
});

export async function logIn(prevState: any, formData: FormData) {
    const data = {
        email: formData.get("email"),
        password: formData.get("password"),
    };
    const result = await formSchema.spa(data);

    if (!result.success) {
        console.log(result.error.flatten());
        return result.error.flatten();
    } else {
        //사용자 X -> 에러
        //사용자 O -> 비교(저장된 데이터에서) -> 비밀번호 확인 (해시값) -> O 로그인+리다이렉트 , X 에러

        const user = await db.user.findUnique({
            where: {
                email: result.data.email,
            },
            select: {
                id: true,
                password: true,
            },
        });
        // 임시 비교 (작성한 pw VS 해시 pw)
        const ok = await bcrypt.compare(result.data.password, user!.password ?? "xxxx");
        if (ok) {
            const session = await getSession();
            session.id = user!.id;
            redirect("/profile");
        } else {
            return {
                //zod 가 아닌 같은 형태로 만든 에러 메시지
                fieldErrors: {
                    password: ["Wrong password."],
                    email: [],
                },
            };
        }
    }
}
