'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

import { cn } from '@/lib/utils';

import { roles, statuses } from '../../data';
import type { Model } from '../../model/schema';

interface PageDetailProps {
  model: Model;
}

export function PageDetail({ model }: PageDetailProps) {
  const status = statuses.find((s) => s.value === model.status);
  const role = roles.find((r) => r.value === model.role);

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <h3 className="mb-4 text-lg font-medium">Personal Information</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-muted-foreground text-sm font-medium">First Name</p>
              <p className="mt-1">{model.first_name}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm font-medium">Last Name</p>
              <p className="mt-1">{model.last_name}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h3 className="mb-4 text-lg font-medium">Account Information</h3>
          <div className="grid gap-4">
            <div>
              <p className="text-muted-foreground text-sm font-medium">Username</p>
              <p className="mt-1">{model.username}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm font-medium">Email</p>
              <p className="mt-1">{model.email}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm font-medium">Phone Number</p>
              <p className="mt-1">{model.phone_number}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h3 className="mb-4 text-lg font-medium">Role & Status</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-muted-foreground text-sm font-medium">Status</p>
              <div className="mt-1">
                {status && (
                  <Badge variant="outline" className={cn('gap-2', status.labelClassName)}>
                    {status.icon && <status.icon className="h-3 w-3" />}
                    <span>{status.label}</span>
                  </Badge>
                )}
              </div>
            </div>
            <div>
              <p className="text-muted-foreground text-sm font-medium">Role</p>
              <div className="mt-1">
                {role && (
                  <div className="flex items-center gap-2">
                    {role.icon && <role.icon className="text-muted-foreground h-4 w-4" />}
                    <span>{role.label}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
