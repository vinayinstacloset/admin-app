import type { CustomerProfile } from "../types/customer.types";

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[9.5px] text-ink/45 mb-0.5">{label}</p>
      <p className="text-[11.5px] text-ink whitespace-nowrap">{value}</p>
    </div>
  );
}

export default function CustomerProfileCard({
  profile,
}: {
  profile: CustomerProfile;
}) {
  return (
    <div className="bg-white rounded-xl border border-black/5 px-4 py-3 mb-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 min-w-[185px]">
          <img
            src={profile.avatar}
            alt=""
            className="w-9 h-9 rounded-full object-cover"
          />
          <div>
            <p className="text-[9.5px] text-ink/45">Full Name</p>
            <p className="text-[12px] font-semibold text-ink">{profile.name}</p>
          </div>
        </div>
        <Field label="Email" value={profile.email} />
        <Field label="Mobile No" value={profile.phone} />
        <Field label="Age/Gender" value={profile.ageGender} />
        <Field label="City/State" value={profile.city} />
        <Field label="Member since" value={profile.since} />
      </div>
    </div>
  );
}
