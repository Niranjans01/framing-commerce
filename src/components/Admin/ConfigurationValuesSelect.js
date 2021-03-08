import Select, { components } from "react-select";
import { SortableContainer, SortableElement } from 'react-sortable-hoc';

import { Fragment, useEffect, useState } from 'react'

function arrayMove(array, from, to) {
  array = array.slice();
  array.splice(to < 0 ? array.length + to : to, 0, array.splice(from, 1)[0]);
  return array;
}

const SortableMultiValue = SortableElement(props => {
  const onMouseDown = e => {
    e.preventDefault();
    e.stopPropagation();
  };
  const innerProps = { onMouseDown };
  return <components.MultiValue {...props} innerProps={innerProps} />;
})

const SortableSelect = SortableContainer(Select);


export default function ConfigurationValuesSelect({optionsLoader, display, id, selectedOptions, optionValueMapper, setSelectedOptions}) {
  const [ options, setOptions ] = useState([]);
  const [ loaded, setLoaded ] = useState(false);
  const [ actualSelectedOptions, setActualSelectedOptions ] = useState([]);

  useEffect(() => {
    optionsLoader({}).then(res => {
      setOptions(res.map(optionValueMapper))
      setLoaded(true)
    });
  }, []);

  useEffect(() => {
    const v = selectedOptions.map(id => {
      return options.find(o => o.value === id);
    }).filter(option => option !== null);
    setActualSelectedOptions(v);
  }, [options, selectedOptions]);

  const onSortEnd = ({ oldIndex, newIndex }) => {
    const newValue = arrayMove(actualSelectedOptions, oldIndex, newIndex);
    setActualSelectedOptions(newValue);
    onChange(newValue);
  };

  const onChange = newOptions => setSelectedOptions(newOptions);

  return (
    <Fragment>
      {loaded ? (
      <SortableSelect
        axis="xy"
        onSortEnd={onSortEnd}
        distance={4}
        getHelperDimensions={({ node }) => node.getBoundingClientRect()}
        value={actualSelectedOptions}
        id={id}
        onChange={onChange}
        components={{
          MultiValue: SortableMultiValue,
        }}
        closeMenuOnSelect={false}
        options={options}
        isMulti
        placeholder={`Select ${display}`}
      />
      ) : (
        <span>Loading...</span>
      )}
    </Fragment>
  );
}
