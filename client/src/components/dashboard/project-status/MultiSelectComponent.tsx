import { Intent } from '@blueprintjs/core/lib/esm/common/intent';
import { MenuItem } from '@blueprintjs/core/lib/esm/components/menu/menuItem';
import { MultiSelect } from '@blueprintjs/select/lib/esm/components/select/multiSelect';

import './ProjectStatus.scss';

interface MultiSelectPropsItem {
  container: any;
  placeholder: any;
  selected: any;
  setSelected: any;
  setFilterOp?: any;
  fieldName?: any;
}

const MultiSelectComponent = (props: MultiSelectPropsItem) => {
  const {
    container,
    placeholder,
    selected,
    setSelected,
    setFilterOp,
    fieldName,
  } = props;

  const f = (x) => (x ? x : []);

  const onItemSelect = (item) => {
    if (!selected.find((si) => si.label === item.label)) {
      setSelected((prev) => [...prev, item]);
      if (setFilterOp) {
        setFilterOp((prev) => {
          const newArray = f(prev[fieldName]);
          newArray.push(item);
          return { ...prev, [fieldName]: newArray };
        });
      }
    }
  };

  const handleTagRemove = (tag, index) => {
    const removeElement = (prev, index) => [
      ...prev.slice(0, index),
      ...prev.slice(index + 1),
    ];
    setSelected((prev) => removeElement(prev, index));
    if (setFilterOp) {
      setFilterOp((prev) => {
        const newArray = removeElement(f(prev[fieldName]), index);
        return { ...prev, [fieldName]: newArray };
      });
    }
  };

  return (
    <>
      <MultiSelect
        tagInputProps={{
          placeholder: placeholder,
          onRemove: handleTagRemove,
        }}
        fill={true}
        itemRenderer={(item) => (
          <MenuItem
            key={item.id}
            onClick={(e: any) => onItemSelect(item)}
            text={item.label}
            className="ttc"
            intent={
              selected.find((si) => si.label === item.label)
                ? Intent.PRIMARY
                : Intent.NONE
            }
            icon={
              selected.find((si) => si.label === item.label)
                ? 'tick'
                : 'square'
            }
          />
        )}
        tagRenderer={(item) => (
          <p className="ma0 white ttc"> {item.label} </p>
        )}
        items={container}
        selectedItems={selected}
        onItemSelect={onItemSelect}
      />
    </>
  );
};

export default MultiSelectComponent;
