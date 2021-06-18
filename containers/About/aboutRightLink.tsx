import { SimpleElement } from "types/components";

const AboutRightLink: SimpleElement = () => {
  return (
    <li className="list-group-item">
      <a className="text-secondary mx-2 d-inline-block" href="https://github.com/MrWangJustToDo/" style={{ height: "22px", width: "22px" }}>
        <img className="w-100 h-100" src="http://github.com/favicon.ico" alt="github" />
      </a>
      <a className="text-secondary mx-2 d-inline-block" href="https://leetcode.com/mrwang-justtodo/" style={{ width: "22px", height: "22px" }}>
        <img className="w-100 h-100" src="https://assets.leetcode.com/static_assets/public/icons/favicon.ico" alt="leetcode" />
      </a>
    </li>
  );
};

export default AboutRightLink;
