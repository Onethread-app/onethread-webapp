export const required = (value: any) => (value ? undefined : "Required");

export const maxValue = (max: number) => (value: any) =>
	value.length <= max ? undefined : `Should be less than or equal ${max}`

export const composeValidators = (...validators: any) => (value: any) =>
	validators.reduce((error: any, validator: any) =>
		error || validator(value), undefined);

export const checkError = (meta: any) => {
	if ((meta.error || (meta.submitError && !meta.dirtySinceLastSubmit)) &&
		meta.touched) {
		return true;
	}
	return false;
};
