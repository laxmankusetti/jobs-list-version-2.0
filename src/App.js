import React, { useState, useEffect } from 'react';
import './App.css';
import Head from './Head'
import removeIcon from './removeIcon.svg';


function App() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/data.json');
      const jobData = await response.json();
      setData(jobData);
      setFilteredData(jobData);
    };
    fetchData();
  }, []);

  function addFilter(filter){
    if(!selectedFilters.includes(filter)){
      setSelectedFilters([...selectedFilters, filter]);
    }
  }

  function removeFilter(filter){
    setSelectedFilters(selectedFilters.filter((item) => item !== filter));
  }

  useEffect(() => {
    if (selectedFilters.length === 0) {
      setFilteredData(data);
    } else {
      setFilteredData(data.filter((job) => {
        const jobFilters = [job.role, job.level, ...job.languages, ...job.tools];
        return selectedFilters.every(filter => jobFilters.includes(filter));
      }));
    }
  }, [selectedFilters, data]);

  let isChoosen = false

  if(selectedFilters.length) isChoosen = true

  return (
    <div className="App">
      <Head />
      {isChoosen && <div className='selected-filters-list'>
          {selectedFilters.map(filter => (
          <span className='filter'>
            {filter}
            <span className='remove-icon' onClick={() => {removeFilter(filter)}}>
              <img src={removeIcon} alt='remove-icon' />
            </span>
          </span>
          ))}
        </div>
      }
      <div className="job-listings">
        {filteredData.map((job) => (
          <div className="job" key={job.id}>
            <div className='logo-company-details'>
              <img src={job.logo} alt={`${job.company} Logo`} id='logo'/>
              <div className="job-details">
                <div className="company">
                  <h3>{job.company}</h3>
                  <div className='new-feature'>
                    {job.new && <span className="new">New!</span>}
                    {job.featured && <span className="featured">Featured</span>}
                  </div>
                </div>
                <h2>{job.position}</h2>
                <p>
                  {job.postedAt} &bull; {job.contract} &bull; {job.location}
                </p>
              </div>
            </div>
            <div className="tags">
              <span className={`tag ${selectedFilters.includes(job.role) ? 'active' : ''}`} onClick={() => addFilter(job.role)}>
                {job.role}
              </span>
              <span className={`tag ${selectedFilters.includes(job.level) ? 'active' : ''}`} onClick={() => addFilter(job.level)}>
                {job.level}
              </span>
              {job.languages.map((language) => (
                <span
                  key={language}
                  className={`tag ${selectedFilters.includes(language) ? 'active' : ''}`}
                  onClick={() => addFilter(language)}
                >
                  {language}
                </span>
              ))}
              {job.tools.map((tool) => (
                <span
                  key={tool}
                  className={`tag ${selectedFilters.includes(tool) ? 'active' : ''}`}
                  onClick={() => addFilter(tool)}
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
