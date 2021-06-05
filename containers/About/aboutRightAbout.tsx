import { SimpleElement } from "types/components";

const AboutRightAbout: SimpleElement = () => {
  return (
    <li className="list-group-item">
      <div className="small">
        <p>一个小菜鸟, 目标是成为一个全栈大佬.</p>
        <p>入门学习:</p>
        <p className="b-text-indent border p-2 rounded">计算机专业知识 + C Language</p>
        <p>后端技术学习:</p>
        <p className="b-text-indent border p-2 rounded">Java、Sql、Mybatis、SpringMVC、SSM、Node.js...</p>
        <p>前端技术学习:</p>
        <p className="b-text-indent border p-2 rounded">HTML、CSS、JavaScript、TypeScript、React、Vue...</p>
        <p>关于这个博客</p>
        <p className="b-text-indent border p-2 rounded">Express + Next.js博客应用</p>
      </div>
    </li>
  );
};

export default AboutRightAbout;
