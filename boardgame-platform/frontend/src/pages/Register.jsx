import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";

export default function Register() {
    const [msg, setMsg] = useState("");
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        try {
            const response = await fetch("http://127.0.0.1:5000/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (response.status === 401) {
                setMsg("이메일 인증 실패: 이메일 또는 비밀번호가 잘못되었습니다.");
                return;
            }

            const responseData = await response.json();
            if(response.ok) {
                setMsg(`회원가입 성공! 이메일 인증 메일이 발송되었습니다.`);
                setTimeout(() => navigate('/login'), 2000);
            } else {
                setMsg(responseData.error || "회원가입 실패!");
            }
        } catch (error) {
            if (error.code === 'EAUTH') {
                setMsg("SMTP 인증 오류: 이메일과 비밀번호가 올바른지 확인하세요.");
            } else {
                console.error("회원가입 중 오류 발생:", error);
                setMsg("회원가입 중 오류가 발생했습니다");
            }
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold mb-4">회원가입</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <input {...register("username", {required: "아이디를 입력하세요"})} placeholder="아이디" className="p-2 border rounded" />
                {errors.username && <p className="text-red-500">{errors.username.message}</p>}
                <input {...register("password", { required: "비밀번호를 입력하세요." })} type="password" placeholder="비밀번호" className="p-2 border rounded" />
                {errors.password && <p className="text-red-500">{errors.password.message}</p>}
                <input {...register("email", { required: "이메일을 입력하세요." })} type="email" placeholder="이메일" className="p-2 border rounded" />
                {errors.email && <p className="text-red-500">{errors.email.message}</p>}
                <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">가입하기</button>
            </form>
            {msg && <p className="mt-4 text-red-500">{msg}</p>}
        </div>
    );
}
