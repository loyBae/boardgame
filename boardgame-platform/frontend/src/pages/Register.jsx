//src/pages/Register.jsx
import { useState } from "react";
import { useNavigate } from 'react-router-dom'
import { useForm } from "react-hook-form"; // 유효성 검사를 쉽게 할 수 있는 , 성능 우수하고 확장 가능한 form 제공 라이브러리

export default function Register() {
    const [msg, setMsg] = useState("");
    const navigate = useNavigate()
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm();

    // 주민번호 입력시 뒷자리 마스킹
    const handleResidentNumberChange = (e) => {
        let value = e.target.value.replace(/[^0-9-]/g, ""); // 숫자 및 '-'만 허용
        if(value.length === 14){
            value = value.slice(0, 8) + "******" // 뒷자리 마스킹
        }
        setValue("residentNumber", value);
    }

      // 로그인 페이지로 돌아가기
  const goLogin = () => {
    navigate('/')
  }

    // 회원가입 API 요청
    const onSubmit = async (data) => {
        try {
            const response = await fetch("http://127.0.0.1:5000/api/registerForm", {
                method: "POST",
                headers: {"content-Type": "application/json"},
                body:JSON.stringify(data),
            });

            const responseData = await response.json();
            if(response.ok) {
               //setMsg("회원가입 성공!");
                setMsg(`회원가입 성공! (유저ID: ${responseData.userId})`);
            } else {
                setMsg(responseData.error || "회원가입 실패!");
            }
        } catch (error) {
            console.error("회원가입 중 오류 발생:", error);
            setMsg("회원가입 중 오류가 발생했습니다");
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold mb-4">회원가입</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

            {/*아이디 */}
            <input {...register("username", {required: "아이디를 입력하세요"})} placeholder="아이디" className="p-2 border rounded" />
            {errors.username && <p className="text-red-500">{errors.username.message}</p>}
            {/* 비밀번호 */}
        <input {...register("password", { required: "비밀번호를 입력하세요." })} type="password" placeholder="비밀번호" className="p-2 border rounded" />
        {errors.password && <p className="text-red-500">{errors.password.message}</p>}

        {/* 비밀번호 확인 */}
        <input {...register("confirmPassword", { required: "비밀번호 확인을 입력하세요." })} type="password" placeholder="비밀번호 확인" className="p-2 border rounded" />
        {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword.message}</p>}

        {/* 이름 */}
        <input {...register("name", { required: "이름을 입력하세요." })} placeholder="이름" className="p-2 border rounded" />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}

        {/* 주민번호 */}
        <input
        {...register("residentNumber", { required: "주민번호를 입력하세요." })}
        placeholder="주민번호 (예: 000000-0000000)"
        className="p-2 border rounded"
        onChange={handleResidentNumberChange}
        />
        {errors.residentNumber && <p className="text-red-500">{errors.residentNumber.message}</p>}

        {/* 성별 선택 */}
        <select {...register("gender", { required: "성별을 선택하세요." })} className="p-2 border rounded">
        <option value="">성별 선택</option>
        <option value="남">남</option>
        <option value="여">여</option>
        </select>
        {errors.gender && <p className="text-red-500">{errors.gender.message}</p>}

        {/* 이메일 */}
        <input {...register("email", { required: "이메일을 입력하세요." })} type="email" placeholder="이메일" className="p-2 border rounded" />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}

        {/* 전화번호 */}
        <input {...register("phone", { required: "전화번호를 입력하세요." })} placeholder="전화번호 (예: 010-1234-5678)" className="p-2 border rounded" />
        {errors.phone && <p className="text-red-500">{errors.phone.message}</p>}

        {/* 회원가입 버튼 */}
        <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
        가입하기
        </button>
    </form>

    {msg && <p className="mt-4 text-red-500">{msg}</p>}
    </div>
    );

}
