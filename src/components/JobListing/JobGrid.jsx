import React from "react";
import JobCard from "../../common/JobCard/JobCard";

const JobGrid = ({ jobs, onApplyNow }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} onApplyNow={() => onApplyNow(job)} />
      ))}
    </div>
  );
};

export default JobGrid;
