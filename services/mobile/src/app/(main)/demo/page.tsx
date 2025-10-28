/**
 * Catalyst UI Kit Demo Page (Mobile)
 * 
 * Mobile-optimized demo of @hephaitos/ui components.
 */

import {
  Button,
  Badge,
  Input,
  Heading,
  Text,
  Divider,
  Switch,
  Checkbox,
} from '@hephaitos/ui';

export default function MobileDemoPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <Heading>Catalyst UI Kit</Heading>
        <Text className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Mobile integration demo
        </Text>
      </div>

      <Divider className="my-6" />

      {/* Buttons */}
      <section className="mb-8">
        <Heading level={2}>Buttons</Heading>
        <div className="mt-3 space-y-3">
          <Button color="primary" className="w-full">
            Primary Button
          </Button>
          <Button outline className="w-full">
            Outline Button
          </Button>
        </div>
      </section>

      <Divider className="my-6" />

      {/* Badges */}
      <section className="mb-8">
        <Heading level={2}>Badges</Heading>
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge color="primary">Primary</Badge>
          <Badge color="green">Success</Badge>
          <Badge color="yellow">Warning</Badge>
          <Badge color="red">Error</Badge>
        </div>
      </section>

      <Divider className="my-6" />

      {/* Form Controls */}
      <section className="mb-8">
        <Heading level={2}>Forms</Heading>
        
        <div className="mt-4 space-y-4">
          <Input
            name="mobile-input"
            placeholder="Enter text..."
          />

          <div className="flex items-center gap-3">
            <Switch name="mobile-switch" defaultChecked />
            <Text className="text-sm">Enable notifications</Text>
          </div>

          <div className="flex items-center gap-3">
            <Checkbox name="mobile-checkbox" defaultChecked />
            <Text className="text-sm">Accept terms</Text>
          </div>
        </div>
      </section>

      <Divider className="my-6" />

      {/* Success Card */}
      <div className="rounded-lg bg-green-50 p-4 dark:bg-green-950/20">
        <Text className="text-sm font-semibold text-green-900 dark:text-green-400">
          ✅ Phase 2 Complete
        </Text>
        <Text className="mt-1 text-xs text-green-800 dark:text-green-300">
          @hephaitos/ui successfully integrated with mobile service.
        </Text>
      </div>
    </div>
  );
}
