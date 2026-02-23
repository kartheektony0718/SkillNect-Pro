import React, { forwardRef } from 'react';

interface ResumeData {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  github_url?: string;
  linkedin_url?: string;
  summary: string;
  experience: any[];
  education: any[];
  skills: string;
}

export const ResumePDFTemplate = forwardRef<HTMLDivElement, { data: ResumeData }>(({ data }, ref) => {
  return (
    <div ref={ref} className="p-10 bg-white text-black w-[794px] min-h-[1123px] font-serif mx-auto">
      {/* Header */}
      <div className="text-center border-b-2 border-gray-300 pb-4 mb-6">
        <h1 className="text-3xl font-bold uppercase">{data.fullName || "Your Name"}</h1>
        <div className="text-sm space-x-2 mt-2">
          <span>{data.email}</span> | <span>{data.phone}</span> | <span>{data.location}</span>
        </div>
        <div className="text-xs text-blue-600 mt-1">
          {data.linkedin_url} {data.github_url && ` | ${data.github_url}`}
        </div>
      </div>

      {/* Summary */}
      <div className="mb-6">
        <h2 className="text-lg font-bold border-b border-gray-300 mb-2 uppercase">Professional Summary</h2>
        <p className="text-sm leading-relaxed">{data.summary}</p>
      </div>

      {/* Experience */}
      <div className="mb-6">
        <h2 className="text-lg font-bold border-b border-gray-300 mb-2 uppercase">Experience</h2>
        {data.experience.map((exp, i) => (
          <div key={i} className="mb-4">
            <div className="flex justify-between font-bold text-sm">
              <span>{exp.title}</span>
              <span>{exp.duration}</span>
            </div>
            <div className="italic text-sm">{exp.company}</div>
            <p className="text-sm mt-1 whitespace-pre-line">{exp.description}</p>
          </div>
        ))}
      </div>

      {/* Education */}
      <div className="mb-6">
        <h2 className="text-lg font-bold border-b border-gray-300 mb-2 uppercase">Education</h2>
        {data.education.map((edu, i) => (
          <div key={i} className="mb-2 flex justify-between text-sm">
            <div><span className="font-bold">{data.education[i].degree}</span>, {data.education[i].institution}</div>
            <span>{data.education[i].year}</span>
          </div>
        ))}
      </div>

      {/* Skills */}
      <div>
        <h2 className="text-lg font-bold border-b border-gray-300 mb-2 uppercase">Skills</h2>
        <p className="text-sm">{data.skills}</p>
      </div>
    </div>
  );
});