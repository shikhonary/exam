"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  UseFormReturn,
} from "@workspace/ui/components/form";
import {
  MapPin,
  Map,
  Hash,
  Building,
  Clipboard,
} from "lucide-react";
import { Input } from "@workspace/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Button } from "@workspace/ui/components/button";
import { CitizenApplicationFormValues } from "@workspace/schema";

interface AddressStepProps {
  form: UseFormReturn<CitizenApplicationFormValues>;
  wards: any[];
  villages: any[];
}

export const AddressStep = ({ form, wards, villages }: AddressStepProps) => {
  return (
    <section className="bg-surface-container-lowest rounded-[32px] p-8 shadow-ambient border border-outline/5 animate-in fade-in slide-in-from-right-8 duration-500 fill-mode-both">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm border border-primary/20">
          <MapPin className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-on-surface tracking-tight">
            Residence Details
          </h2>
          <p className="text-sm text-on-surface-variant font-medium italic">
            Present and permanent address records
          </p>
        </div>
      </div>

      <div className="space-y-12">
        {/* Present Address Sub-section */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-6 w-1 bg-primary rounded-full" />
            <h3 className="text-sm font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Present Address
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="presentWardNo"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="flex items-center gap-2 text-[11px] font-black text-on-surface tracking-widest uppercase opacity-70">
                    <Hash className="w-3.5 h-3.5" /> ওয়ার্ড নং <span className="text-rose-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={(val) => field.onChange(parseInt(val))}
                    defaultValue={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger className="h-12 bg-surface-container-low border-none rounded-2xl px-4 font-bold w-full focus:ring-2 focus:ring-primary/40">
                        <SelectValue placeholder="ওয়ার্ড" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-2xl border-outline/5">
                      {wards.map((w) => (
                        <SelectItem key={w.id} value={w.name.toString()} className="font-bold">
                          ওয়ার্ড নং {w.displayName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="presentVillageBn"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="flex items-center gap-2 text-[11px] font-black text-on-surface tracking-widest uppercase opacity-70">
                    <Map className="w-3.5 h-3.5" /> গ্রাম (বাংলা) <span className="text-rose-500">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-12 bg-surface-container-low border-none rounded-2xl px-4 font-bold w-full focus:ring-2 focus:ring-primary/40">
                        <SelectValue placeholder="গ্রাম নির্বাচন করুন" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-2xl border-outline/5">
                      {villages.map((v) => (
                        <SelectItem key={v.id} value={v.displayName} className="font-bold">{v.displayName}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="presentPostOffice"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="flex items-center gap-2 text-[11px] font-black text-on-surface tracking-widest uppercase opacity-70">
                    <Building className="w-3.5 h-3.5" /> ডাকঘর <span className="text-rose-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="ডাকঘর লিখুন" className="h-12 bg-surface-container-low border-none rounded-2xl px-4 font-bold w-full" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="presentUpazila"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="flex items-center gap-2 text-[11px] font-black text-on-surface tracking-widest uppercase opacity-70">
                    <MapPin className="w-3.5 h-3.5" /> উপজেলা <span className="text-rose-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="উপজেলা লিখুন" className="h-12 bg-surface-container-low border-none rounded-2xl px-4 font-bold w-full" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="presentDistrict"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="flex items-center gap-2 text-[11px] font-black text-on-surface tracking-widest uppercase opacity-70">
                    <MapPin className="w-3.5 h-3.5" /> জেলা <span className="text-rose-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="জেলা লিখুন" className="h-12 bg-surface-container-low border-none rounded-2xl px-4 font-bold w-full" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="presentHoldingNo"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="flex items-center gap-2 text-[11px] font-black text-on-surface tracking-widest uppercase opacity-70">
                    <Hash className="w-3.5 h-3.5" /> হোল্ডিং নং
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="হোল্ডিং নং লিখুন" className="h-12 bg-surface-container-low border-none rounded-2xl px-4 font-bold w-full" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Permanent Address Sub-section */}
        <div className="space-y-6 pt-6 border-t border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="h-6 w-1 bg-primary rounded-full" />
              <h3 className="text-sm font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" /> Permanent Address
              </h3>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-[10px] font-black text-primary hover:bg-primary/5 uppercase tracking-tighter flex items-center gap-2"
              onClick={() => {
                const values = form.getValues();
                form.setValue("permanentVillageBn", values.presentVillageBn, { shouldValidate: true, shouldDirty: true });
                form.setValue("permanentRoadBlockSectorBn", values.presentRoadBlockSectorBn, { shouldValidate: true, shouldDirty: true });
                form.setValue("permanentHoldingNo", values.presentHoldingNo, { shouldValidate: true, shouldDirty: true });
                form.setValue("permanentWardNo", values.presentWardNo, { shouldValidate: true, shouldDirty: true });
                form.setValue("permanentDistrict", values.presentDistrict, { shouldValidate: true, shouldDirty: true });
                form.setValue("permanentUpazila", values.presentUpazila, { shouldValidate: true, shouldDirty: true });
                form.setValue("permanentPostOffice", values.presentPostOffice, { shouldValidate: true, shouldDirty: true });
              }}
            >
              <Clipboard className="w-3 h-3" /> Copy Present Address
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="permanentWardNo"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="flex items-center gap-2 text-[11px] font-black text-on-surface tracking-widest uppercase opacity-70">
                    <Hash className="w-3.5 h-3.5" />ওয়ার্ড নং <span className="text-rose-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={(val) => field.onChange(parseInt(val))}
                    defaultValue={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger className="h-12 bg-surface-container-low border-none rounded-2xl px-4 font-bold w-full focus:ring-2 focus:ring-primary/40">
                        <SelectValue placeholder="ওয়ার্ড" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-2xl border-outline/5">
                      {wards.map((w) => (
                        <SelectItem key={w.id} value={w.name.toString()} className="font-bold">
                          ওয়ার্ড নং {w.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="permanentVillageBn"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="flex items-center gap-2 text-[11px] font-black text-on-surface tracking-widest uppercase opacity-70">
                    <Map className="w-3.5 h-3.5" /> গ্রাম (বাংলা) <span className="text-rose-500">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-12 bg-surface-container-low border-none rounded-2xl px-4 font-bold w-full focus:ring-2 focus:ring-primary/40">
                        <SelectValue placeholder="গ্রাম নির্বাচন করুন" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-2xl border-outline/5">
                      {villages.map((v) => (
                        <SelectItem key={v.id} value={v.displayName} className="font-bold">{v.displayName}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="permanentPostOffice"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="flex items-center gap-2 text-[11px] font-black text-on-surface tracking-widest uppercase opacity-70">
                    <Building className="w-3.5 h-3.5" /> ডাকঘর <span className="text-rose-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="ডাকঘর লিখুন" className="h-12 bg-surface-container-low border-none rounded-2xl px-4 font-bold w-full" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="permanentUpazila"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="flex items-center gap-2 text-[11px] font-black text-on-surface tracking-widest uppercase opacity-70">
                    <MapPin className="w-3.5 h-3.5" /> উপজেলা <span className="text-rose-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="উপজেলা লিখুন" className="h-12 bg-surface-container-low border-none rounded-2xl px-4 font-bold w-full" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="permanentDistrict"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="flex items-center gap-2 text-[11px] font-black text-on-surface tracking-widest uppercase opacity-70">
                    <MapPin className="w-3.5 h-3.5" /> জেলা <span className="text-rose-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="জেলা লিখুন" className="h-12 bg-surface-container-low border-none rounded-2xl px-4 font-bold w-full" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="permanentHoldingNo"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="flex items-center gap-2 text-[11px] font-black text-on-surface tracking-widest uppercase opacity-70">
                    <Hash className="w-3.5 h-3.5" /> হোল্ডিং নং
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="হোল্ডিং নং লিখুন" className="h-12 bg-surface-container-low border-none rounded-2xl px-4 font-bold w-full" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
