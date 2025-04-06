// app/exam/layout.jsx


export default function ExamLayout({ children }) {
  return (
    <div>
      
      <div className="mx-3 md:mx-5 lg:px-40 mt-5">
        {children}  {/* This will wrap page.jsx */}
      </div>
    </div>
  );
}
