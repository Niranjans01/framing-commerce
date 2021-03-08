import Select, { components } from "react-select";
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import {useEffect, useState} from "react";

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


export default function ConfigurationSelect({options, id, configurations, configurationValueMapper, setConfigurations}) {
  const onSortEnd = ({ oldIndex, newIndex }) => {
    const newValue = arrayMove(values, oldIndex, newIndex);
    setConfigurations(newValue);
  };

  const [values, setValues] = useState([]);

  useEffect(() => {
    setValues(configurations.map(configurationValueMapper))
  }, [configurations]);

  const onChange = selectedOptions => setConfigurations(selectedOptions);

  return (
    <SortableSelect
      axis="xy"
      onSortEnd={onSortEnd}
      distance={4}
      getHelperDimensions={({ node }) => node.getBoundingClientRect()}
      value={values}
      id={id}
      onChange={onChange}
      components={{
        MultiValue: SortableMultiValue,
      }}
      closeMenuOnSelect={false}
      options={options}
      isMulti
      />
  );
}
