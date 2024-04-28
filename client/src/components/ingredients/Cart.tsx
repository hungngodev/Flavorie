import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form';

export default function Cart() {
  const { register, control, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      test: [{ firstName: 'Bill', lastName: 'Luo' }],
    },
  });
  const { fields, append, prepend, remove, swap, move, insert, replace } = useFieldArray({
    control,
    name: 'test',
  });
  console.log(watch('test'));

  const onSubmit = (data) => console.log('data', data);
  const watchResult = watch('test');
  console.log(watchResult);
  console.log(useWatch({ name: 'test', control }));

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ul>
        {fields.map((item, index) => {
          return (
            <li key={item.id}>
              <input {...register(`test.${index}.firstName`, { required: true })} />

              <Controller
                render={({ field }) => <input {...field} />}
                name={`test.${index}.lastName`}
                control={control}
              />
              <button type="button" onClick={() => remove(index)}>
                Delete
              </button>
            </li>
          );
        })}
      </ul>
      <input type="submit" />
    </form>
  );
}
