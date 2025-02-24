import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function Register() {
    const [msg, setMsg] = useState("");
    const [nicknameMsg, setNicknameMsg] = useState("");
    const [NicknameChecked, setNicknameChecked] = useState(""); // 닉네임 중복 확인 여부
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, watch } = useForm();

    const checkNickname = async () => {
        const nickname = watch("nickname");
        if (!nickname) {
            setNicknameMsg("닉네임을 입력하세요.");
            return;
        }
        try {
            const response = await fetch(`${BASE_URL}/api/auth/check-nickname?nickname=${nickname}`);
            const data = await response.json();
            if (response.ok) {
                setNicknameMsg("사용 가능한 닉네임입니다.");
                setNicknameChecked(true); // 중복 확인 완료
            } else {
                setNicknameMsg(data.error || "이미 사용 중인 닉네임입니다.");
                setNicknameChecked(false);
            }
        } catch (error) {
            setNicknameMsg("닉네임 확인 중 오류가 발생했습니다.");
            setNicknameChecked(false);
        }
    };

    const onSubmit = async (data) => {
        if (!NicknameChecked) {
            setMsg("닉네임 중복 여부를 확인하고 가입 버튼을 눌러주세요.");
            return;
        }
        try {
            const response = await fetch(`${BASE_URL}/api/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (response.status === 401) {
                setMsg("이메일 인증 실패: 이메일 또는 비밀번호가 잘못되었습니다.");
                return;
            }

            const responseData = await response.json();
            if (response.ok) {
                setMsg(`회원가입 성공! 이메일 인증 메일이 발송되었습니다.`);
                setTimeout(() => navigate('/auth/login'), 2000);
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
                <input {...register("username", { required: "아이디를 입력하세요" })} placeholder="아이디" className="p-2 border rounded" />
                {errors.username && <p className="text-red-500">{errors.username.message}</p>}
                <input {...register("password", { required: "비밀번호를 입력하세요." })} type="password" placeholder="비밀번호" className="p-2 border rounded" />
                {errors.password && <p className="text-red-500">{errors.password.message}</p>}
                <div className="flex gap-2 items-center">
                    <input {...register("nickname", { required: "닉네임을 입력하세요." })} placeholder="닉네임" className="p-2 border rounded flex-1" />
                    <button type="button" onClick={checkNickname} className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600">중복 확인</button>
                </div>
                {nicknameMsg && <p className={`text-${nicknameMsg.includes('사용 가능') ? 'green' : 'red'}-500`}>{nicknameMsg}</p>}
                <input {...register("email", { required: "이메일을 입력하세요." })} type="email" placeholder="이메일" className="p-2 border rounded" />
                {errors.email && <p className="text-red-500">{errors.email.message}</p>}
                <select {...register("gender", { required: "성별을 선택하세요." })} className="p-2 border rounded">
                    <option value="">성별 선택</option>
                    <option value="남">남</option>
                    <option value="여">여</option>
                </select>
                {errors.gender && <p className="text-red-500">{errors.gender.message}</p>}
                <div className="flex justify-center space-x-4">
                    <button type="submit" className="bg-blue-500 text-white w-auto px-4 py-2 rounded hover:bg-blue-600">가입하기</button>
                    <button type="button" onClick={() => navigate("/login")} className="bg-yellow-500 text-white w-auto px-4 py-2 rounded hover:bg-blue-600">취소</button>
                </div>
            </form>
            {msg && <p className="mt-4 text-red-500">{msg}</p>}
        </div>
    );
}
