// app/exam/layout.jsx


export default function ExamLayout({ children }) {
  return (
    <div>
      
      <div className="mx-1 md:mx-3 lg:mx-40 mt-3">
        {children}  {/* This will wrap page.jsx */}
      </div>
    </div>
  );
}
