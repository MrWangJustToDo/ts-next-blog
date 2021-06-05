import { SubmitType } from "types/containers";

const LoginSubmit: SubmitType = ({ enabled }) => {
  return (
    <div className="form-row justify-content-around">
      <button type="submit" className="btn px-5 my-2 btn-info" disabled={!enabled}>
        登录
      </button>
    </div>
  );
};

export default LoginSubmit;
