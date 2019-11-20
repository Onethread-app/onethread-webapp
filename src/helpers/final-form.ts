export const required = (value: any) => (value ? undefined : "Required");

export const composeValidators = (...validators: any) => (value: any) =>
	validators.reduce(
		(error: any, validator: any) => error || validator(value),
		undefined
	);

export const checkError = (meta: any) => {
	if ((meta.error || meta.submitError) && meta.touched) {
		return true;
	} else {
		return false;
	}
};
