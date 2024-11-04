import type { Meta, StoryObj } from "@storybook/react";

import { Heading, type HeadingProps } from "./heading";

const meta: Meta<HeadingProps> = {
    title: 'Heading',
    component: Heading,
    argTypes: {
        // 3. Make children text so we can update it
        children: {
            control: {
                type: "text",
            }
        },
        // 4. Update level, size, and align to dropdown select
        level: {
            options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
            control: {
                type: "select",
            }
        },
        size: {
            options: ['sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl'],
            control: {
                type: 'select'
            }
        },
        align: {
            options: ['left', 'center', 'right'],
            control: {
                type: "select",
            }
        }
    },
    args: {
        level: 'h1',
        size: 'base',
        children: 'Hello Chat!!',
        align: 'left'
    }
}

export default meta;

type Story = StoryObj<typeof Heading>;
export const Playground: Story = {
    args: {
        size: "base",
        align: "left"
    }
};