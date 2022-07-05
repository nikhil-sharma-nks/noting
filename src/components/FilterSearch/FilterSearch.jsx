import React, { useState } from 'react';
import './filterSearch.scss';
import Select from 'react-select';
import { useNote } from '../../context';

const FilterSearch = () => {
  const { noteState, noteDispatch } = useNote();
  const { searchQuery } = noteState;
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);

  const DateFitlerOptions = [
    { value: 'date-latest', label: 'Date(Latest)' },
    { value: 'date-oldest', label: 'Date(Oldest)' },
  ];
  const PriorityFilterOptions = [
    { value: 'low', label: 'Low Only' },
    { value: 'medium', label: 'Medium Only' },
    { value: 'high', label: 'High Only' },
    { value: 'low-to-high', label: 'Low To High' },
    { value: 'high-to-low', label: 'High To Low' },
  ];

  const checkIfChecked = (label) => {
    return selectedTags.includes(label);
  };
  const handleLabelClick = (label, isChecked) => {
    if (isChecked) {
      setSelectedTags((s) => {
        noteDispatch({ type: 'FILTER_TAGS', payload: [...s, label] });
        return [...s, label];
      });
    } else {
      const newSet = new Set(selectedTags);
      newSet.delete(label);
      setSelectedTags([...newSet]);
      noteDispatch({ type: 'FILTER_TAGS', payload: [...newSet] });
    }
  };
  const handleDateFilterChange = (selectedOption) => {
    noteDispatch({ type: 'FILTER_DATE', payload: selectedOption });
  };
  const handlePriorityFilterChange = (selectedOption) => {
    noteDispatch({ type: 'FILTER_PRIORITY', payload: selectedOption });
  };
  const handleInputChange = (e) => {
    noteDispatch({
      type: 'SEARCH_QUERY',
      payload: e.target.value,
    });
  };

  const handleAddNewNote = () => noteDispatch({ type: 'OPEN_NEW_NOTE' });

  const handleClear = () => {
    noteDispatch({ type: 'CLEAR_FILTER' });
    setSelectedTags([]);
  };
  const styles = {
    option: (provided, state) => ({
      ...provided,
      color: 'black',
    }),
    singleValue: (provided, state) => ({
      ...provided,
      fontSize: state.selectProps.myFontSize,
    }),
  };
  const toggleFilterModal = () => {
    setIsFilterModalOpen((prev) => {
      if (!prev) {
        noteDispatch({
          type: 'CLOSE_NEW_NOTE',
        });
      }
      return !prev;
    });
  };
  return (
    <>
      <div className='search-filter-container'>
        <div className='navbar-search mb-4'>
          <i className='fa-solid fa-magnifying-glass'></i>
          <input
            type='text'
            className='form-control'
            placeholder='Search Notes Here'
            value={searchQuery}
            onChange={handleInputChange}
          />
          <i
            className='fa-solid fa-xmark search-cancel'
            onClick={() =>
              noteDispatch({
                type: 'SEARCH_QUERY',
                payload: '',
              })
            }
          ></i>
          <i
            className='fa-solid fa-filter filter-btn'
            onClick={toggleFilterModal}
          ></i>
          <div className='add-note-btn' onClick={handleAddNewNote}>
            <i className='fas fa-plus '></i>
          </div>
          {isFilterModalOpen && (
            <div className='filter-container'>
              <div className='filter'>
                <div className='filter-header'>
                  <p className='text-l'>Filters</p>
                  <i
                    className='fa-solid fa-xmark search-cancel'
                    onClick={() => {
                      setIsFilterModalOpen(false);
                    }}
                  ></i>
                </div>
                <div className='select-container'>
                  <p>Sort By Date : </p>
                  <Select
                    onChange={handleDateFilterChange}
                    options={DateFitlerOptions}
                    styles={styles}
                    value={noteState.filter.sortBy}
                    placeholder='Date'
                    className='select-box'
                    isClearable
                  />
                </div>
                <div className='select-container'>
                  <p>Sort By Priority : </p>
                  <Select
                    onChange={handlePriorityFilterChange}
                    options={PriorityFilterOptions}
                    styles={styles}
                    value={noteState.filter.filterPriority}
                    placeholder='Priority'
                    className='select-box'
                    isClearable
                  />
                </div>
                <div className='tags-container'>
                  <p>Filter By Tags</p>
                  <div className='tags mt-2'>
                    {noteState.labels?.map((label) => (
                      <div className='input-container' key={label}>
                        <input
                          type='checkbox'
                          name={label}
                          checked={checkIfChecked(label)}
                          onChange={(e) =>
                            handleLabelClick(label, e.target.checked)
                          }
                        />
                        <label className='ml-1'>{label}</label>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <button
                    className='btn btn-error-outlined'
                    onClick={handleClear}
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export { FilterSearch };
