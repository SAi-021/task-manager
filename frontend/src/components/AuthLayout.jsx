export default function AuthLayout({ children }) {
  return (
    <div className="auth-wrap">
      <aside className="auth-aside">
        <div className="mark"><h1>Taskboard </h1></div>
        <div>
          <h1>
            Move work <em>forward</em>, one stage at a time.
          </h1>
          
          <div className="auth-stages">
            <span>Todo</span>
            <span>In&nbsp;Progress</span>
            <span>Done</span>
          </div>
        </div>
        <div style={{ fontSize: "0.8rem", color: "rgba(244,240,232,0.55)" }}>
         
        </div>
      </aside>
      <main className="auth-main">{children}</main>
    </div>
  );
}
