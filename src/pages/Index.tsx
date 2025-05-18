
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-4xl md:text-5xl font-bold text-navy-800 mb-4">ResumeAI</h1>
      <p className="text-xl text-gray-600 max-w-2xl mb-8">
        Tailor your resume for each job application with AI-powered insights. Track your job applications and boost your chances of landing your dream job.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl mb-12">
        <div className="resume-card flex flex-col items-center p-6">
          <div className="w-12 h-12 bg-navy-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-navy-800 text-xl font-bold">1</span>
          </div>
          <h3 className="font-semibold text-lg mb-2">Create Your Profile</h3>
          <p className="text-gray-600 text-center mb-4">
            Build your base resume with personal details, experience, and skills
          </p>
          <Button 
            onClick={() => navigate("/profile")}
            className="mt-auto w-full bg-navy-600 hover:bg-navy-700"
          >
            Create Profile
          </Button>
        </div>

        <div className="resume-card flex flex-col items-center p-6">
          <div className="w-12 h-12 bg-navy-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-navy-800 text-xl font-bold">2</span>
          </div>
          <h3 className="font-semibold text-lg mb-2">Tailor Your Resume</h3>
          <p className="text-gray-600 text-center mb-4">
            Analyze job descriptions and customize your resume for each application
          </p>
          <Button 
            onClick={() => navigate("/tailor")}
            className="mt-auto w-full bg-navy-600 hover:bg-navy-700"
          >
            Tailor Resume
          </Button>
        </div>

        <div className="resume-card flex flex-col items-center p-6">
          <div className="w-12 h-12 bg-navy-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-navy-800 text-xl font-bold">3</span>
          </div>
          <h3 className="font-semibold text-lg mb-2">Track Applications</h3>
          <p className="text-gray-600 text-center mb-4">
            Manage your job applications and monitor your progress
          </p>
          <Button 
            onClick={() => navigate("/jobs")}
            className="mt-auto w-full bg-navy-600 hover:bg-navy-700"
          >
            Track Jobs
          </Button>
        </div>
      </div>

      <div className="max-w-3xl">
        <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
        <ol className="text-left space-y-4">
          <li className="flex gap-3">
            <span className="highlight-text">1.</span>
            <span>
              <strong>Create your base resume</strong> by adding your personal information, professional experience, and skills.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="highlight-text">2.</span>
            <span>
              <strong>Paste job descriptions</strong> to compare against your profile and identify relevant skills and potential gaps.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="highlight-text">3.</span>
            <span>
              <strong>Update your resume</strong> with tailored bullet points and additional skills based on the analysis.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="highlight-text">4.</span>
            <span>
              <strong>Track your job applications</strong> and keep notes on your progress for each opportunity.
            </span>
          </li>
        </ol>
      </div>
    </div>
  );
};

export default Index;
