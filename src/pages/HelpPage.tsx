
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle } from "lucide-react";

const HelpPage = () => {
  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <Card className="w-full max-w-4xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-3">
            <HelpCircle size={32} className="text-navy-600" />
          </div>
          <CardTitle className="text-2xl">ResumeAI Help Center</CardTitle>
          <CardDescription>Get help with using the platform and managing your job applications</CardDescription>
        </CardHeader>
        
        <Tabs defaultValue="getting-started" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
            <TabsTrigger value="job-tracking">Job Tracking</TabsTrigger>
            <TabsTrigger value="resume">Resume Tailoring</TabsTrigger>
          </TabsList>
          
          <TabsContent value="getting-started">
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Welcome to ResumeAI</h3>
                <p className="text-gray-700">
                  ResumeAI helps you manage your job search process from start to finish. Here's how to get started:
                </p>
                <ol className="list-decimal pl-5 space-y-2 pt-2">
                  <li>Complete your profile with your personal information, experience, and skills</li>
                  <li>Use the resume tailoring tool to customize your resume for specific job descriptions</li>
                  <li>Track your job applications using the job tracker</li>
                </ol>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Account Management</h3>
                <p className="text-gray-700">
                  Your account securely stores all your profile data. To manage your account:
                </p>
                <ul className="list-disc pl-5 space-y-1 pt-2">
                  <li>Update your profile information anytime through the Profile page</li>
                  <li>Your data is automatically saved as you make changes</li>
                  <li>Use the sign-out button in the navigation bar to log out securely</li>
                </ul>
              </div>
            </CardContent>
          </TabsContent>
          
          <TabsContent value="job-tracking">
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Job Application Tracker</h3>
                <p className="text-gray-700">
                  Keep all your job applications organized in one place:
                </p>
                <ul className="list-disc pl-5 space-y-1 pt-2">
                  <li>Add new job applications with details like company name, position, and application date</li>
                  <li>Track the status of each application (Applied, Interviewing, Offered, Rejected)</li>
                  <li>Add notes to keep track of important details for each application</li>
                  <li>Archive applications you're no longer pursuing</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Job Status Management</h3>
                <p className="text-gray-700">
                  As your application progresses, update its status:
                </p>
                <ul className="list-disc pl-5 space-y-1 pt-2">
                  <li>Click on the status buttons to update the job status</li>
                  <li>Use the "Return to Applied" option if you need to revert a status change</li>
                  <li>Archive jobs you're no longer interested in</li>
                  <li>Add detailed notes about interviews, offers, or rejections</li>
                </ul>
              </div>
            </CardContent>
          </TabsContent>
          
          <TabsContent value="resume">
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Resume Tailoring</h3>
                <p className="text-gray-700">
                  Customize your resume for each job application:
                </p>
                <ul className="list-disc pl-5 space-y-1 pt-2">
                  <li>Paste the job description to analyze required skills</li>
                  <li>Get AI-powered suggestions for improving your resume</li>
                  <li>Highlight relevant skills that match the job description</li>
                  <li>Customize experience bullet points for each application</li>
                  <li>Download your tailored resume as a PDF</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Skills Management</h3>
                <p className="text-gray-700">
                  Keep your skills updated to improve job matching:
                </p>
                <ul className="list-disc pl-5 space-y-1 pt-2">
                  <li>Add and remove skills from your profile</li>
                  <li>See which skills are relevant for each job description</li>
                  <li>Identify missing skills that you might want to acquire</li>
                </ul>
              </div>
            </CardContent>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default HelpPage;
