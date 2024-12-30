"use server";
export const handleForm = async (prevSate: any, formData: FormData) => {
    console.log("prevSate:", prevSate);
    await new Promise((resolve) => setTimeout(resolve, 5000));
    return {
        error: ["wrong password", "password too short"],
    };
};
