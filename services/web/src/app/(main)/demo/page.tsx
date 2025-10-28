/**
 * Catalyst UI Kit Demo Page
 * 
 * Showcases @hephaitos/ui components integrated from Catalyst UI Kit.
 * This page demonstrates the successful Phase 2 integration.
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
  Radio,
} from '@hephaitos/ui';

export default function DemoPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10">
        <Heading>Catalyst UI Kit Integration Demo</Heading>
        <Text className="mt-2 text-zinc-600 dark:text-zinc-400">
          Successfully integrated 27 Catalyst components into @hephaitos/ui package.
        </Text>
      </div>

      <Divider className="my-8" />

      {/* Buttons Section */}
      <section className="mb-12">
        <Heading level={2}>Buttons</Heading>
        <div className="mt-4 flex flex-wrap gap-4">
          <Button color="primary">Primary Button</Button>
          <Button color="secondary">Secondary Button</Button>
          <Button outline>Outline Button</Button>
          <Button plain>Plain Button</Button>
        </div>
      </section>

      <Divider className="my-8" />

      {/* Badges Section */}
      <section className="mb-12">
        <Heading level={2}>Badges</Heading>
        <div className="mt-4 flex flex-wrap gap-3">
          <Badge color="primary">Primary</Badge>
          <Badge color="green">Success</Badge>
          <Badge color="yellow">Warning</Badge>
          <Badge color="red">Error</Badge>
          <Badge color="zinc">Default</Badge>
        </div>
      </section>

      <Divider className="my-8" />

      {/* Form Controls Section */}
      <section className="mb-12">
        <Heading level={2}>Form Controls</Heading>
        
        <div className="mt-6 max-w-md space-y-6">
          {/* Input */}
          <div>
            <label className="block text-sm font-medium text-zinc-900 dark:text-white">
              Text Input
            </label>
            <Input
              name="demo-input"
              placeholder="Enter text..."
              className="mt-1"
            />
          </div>

          {/* Switch */}
          <div className="flex items-center gap-3">
            <Switch name="demo-switch" defaultChecked />
            <Text>Enable notifications</Text>
          </div>

          {/* Checkbox */}
          <div className="flex items-center gap-3">
            <Checkbox name="demo-checkbox" defaultChecked />
            <Text>Accept terms and conditions</Text>
          </div>

          {/* Radio Group */}
          <div>
            <Text className="mb-2 font-medium">Select an option</Text>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Radio name="demo-radio" value="option1" defaultChecked />
                <Text>Option 1</Text>
              </div>
              <div className="flex items-center gap-3">
                <Radio name="demo-radio" value="option2" />
                <Text>Option 2</Text>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Divider className="my-8" />

      {/* Success Message */}
      <section className="rounded-lg bg-green-50 p-6 dark:bg-green-950/20">
        <Heading level={3} className="text-green-900 dark:text-green-400">
          ✅ Phase 2 Complete (40% → 50%)
        </Heading>
        <Text className="mt-2 text-green-800 dark:text-green-300">
          Catalyst UI Kit integration successful. All 27 components are now available
          in the @hephaitos/ui package and ready for use across web and mobile services.
        </Text>
        
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-md bg-white p-3 shadow-sm dark:bg-zinc-900">
            <Text className="text-sm font-semibold">Package Created</Text>
            <Text className="text-xs text-zinc-600 dark:text-zinc-400">
              @hephaitos/ui
            </Text>
          </div>
          <div className="rounded-md bg-white p-3 shadow-sm dark:bg-zinc-900">
            <Text className="text-sm font-semibold">Components</Text>
            <Text className="text-xs text-zinc-600 dark:text-zinc-400">
              27 Catalyst UI components
            </Text>
          </div>
          <div className="rounded-md bg-white p-3 shadow-sm dark:bg-zinc-900">
            <Text className="text-sm font-semibold">Tailwind v4</Text>
            <Text className="text-xs text-zinc-600 dark:text-zinc-400">
              CSS-first configuration
            </Text>
          </div>
        </div>
      </section>
    </div>
  );
}
