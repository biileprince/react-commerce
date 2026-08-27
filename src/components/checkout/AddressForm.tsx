import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { addressSchema, type AddressFormValues, GHANA_REGIONS } from '@/lib/validations';
import { cn } from '@/lib/utils';

interface AddressFormProps {
  onSubmit: (data: AddressFormValues) => void | Promise<void>;
  isLoading?: boolean;
  defaultValues?: Partial<AddressFormValues>;
  submitLabel?: string;
}

export function AddressForm({
  onSubmit,
  isLoading = false,
  defaultValues,
  submitLabel = 'Save Address',
}: AddressFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      fullName: '',
      phoneNumber: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      region: undefined,
      district: '',
      landmark: '',
      ...defaultValues,
    },
  });

  const selectedRegion = watch('region');

  const Field = ({
    label,
    error,
    required,
    children,
  }: {
    label: string;
    error?: string;
    required?: boolean;
    children: React.ReactNode;
  }) => (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium">
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {/* Name + Phone row */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full Name" error={errors.fullName?.message} required>
          <Input
            {...register('fullName')}
            id="fullName"
            placeholder="Kofi Mensah"
            autoComplete="name"
            className={cn(errors.fullName && 'border-destructive')}
          />
        </Field>
        <Field label="Phone Number" error={errors.phoneNumber?.message} required>
          <Input
            {...register('phoneNumber')}
            id="phoneNumber"
            type="tel"
            placeholder="0244123456"
            autoComplete="tel"
            className={cn(errors.phoneNumber && 'border-destructive')}
          />
        </Field>
      </div>

      {/* Address Line 1 */}
      <Field label="Address Line 1" error={errors.addressLine1?.message} required>
        <Input
          {...register('addressLine1')}
          id="addressLine1"
          placeholder="House number, street name"
          autoComplete="address-line1"
          className={cn(errors.addressLine1 && 'border-destructive')}
        />
      </Field>

      {/* Address Line 2 */}
      <Field label="Address Line 2" error={errors.addressLine2?.message}>
        <Input
          {...register('addressLine2')}
          id="addressLine2"
          placeholder="Apartment, suite, etc. (optional)"
          autoComplete="address-line2"
        />
      </Field>

      {/* City + Region row */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="City" error={errors.city?.message} required>
          <Input
            {...register('city')}
            id="city"
            placeholder="Accra"
            autoComplete="address-level2"
            className={cn(errors.city && 'border-destructive')}
          />
        </Field>

        <Field label="Region" error={errors.region?.message} required>
          <Select
            value={selectedRegion}
            onValueChange={(val) => setValue('region', val as AddressFormValues['region'], { shouldValidate: true })}
          >
            <SelectTrigger
              id="region"
              className={cn(errors.region && 'border-destructive')}
            >
              <SelectValue placeholder="Select region" />
            </SelectTrigger>
            <SelectContent>
              {GHANA_REGIONS.map((region) => (
                <SelectItem key={region} value={region}>
                  {region}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>

      {/* District + Landmark row */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="District" error={errors.district?.message}>
          <Input
            {...register('district')}
            id="district"
            placeholder="e.g. Osu, Labadi (optional)"
          />
        </Field>
        <Field label="Landmark" error={errors.landmark?.message}>
          <Input
            {...register('landmark')}
            id="landmark"
            placeholder="Nearby landmark (optional)"
          />
        </Field>
      </div>

      <Button type="submit" className="w-full gap-2" disabled={isLoading} size="lg">
        {isLoading ? (
          <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</>
        ) : (
          submitLabel
        )}
      </Button>
    </form>
  );
}
