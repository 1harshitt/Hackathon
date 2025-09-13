import Pipeline from '../pipelineModel.js';
import Stage from '../stageModel.js';
import Filter from '../filterModel.js';

const defaultFilters = {
    category: [
        "Product",
        "Service",
        "Consulting",
        "Training",
        "Support"
    ],
    source: [
        "Website",
        "Referral",
        "Social Media",
        "Email Campaign",
        "Trade Show",
        "Cold Call",
        "Partner",
        "Advertisement"
    ],
    tag: [
        "High Priority",
        "Low Priority",
        "Follow Up",
        "VIP",
        "New Client"
    ],
    label: [
        "Hot Lead",
        "Warm Lead",
        "Cold Lead",
        "Qualified",
        "Not Qualified"
    ],
    status: [
        "Active",
        "Inactive",
        "Pending",
        "On Hold",
        "Completed"
    ]
};

const defaultPipelines = [
    {
        name: "Sales",
        stages: [
            { name: "Lead Qualification", type: "lead", order: 0 },
            { name: "Initial Contact", type: "lead", order: 1 },
            { name: "Need Analysis", type: "lead", order: 2 },
            { name: "Lead Nurturing", type: "lead", order: 3 },
            { name: "Proposal Draft", type: "proposal", order: 0 },
            { name: "Proposal Review", type: "proposal", order: 1 },
            { name: "Proposal Sent", type: "proposal", order: 2 },
            { name: "Negotiation", type: "proposal", order: 3 }
        ]
    },
    {
        name: "Marketing",
        stages: [
            { name: "Lead Generation", type: "lead", order: 0 },
            { name: "Lead Scoring", type: "lead", order: 1 },
            { name: "Campaign Planning", type: "lead", order: 2 },
            { name: "Lead Nurturing", type: "lead", order: 3 },
            { name: "Campaign Proposal", type: "proposal", order: 0 },
            { name: "Budget Review", type: "proposal", order: 1 },
            { name: "Strategy Development", type: "proposal", order: 2 },
            { name: "Campaign Launch", type: "proposal", order: 3 }
        ]
    }
];

const initializeDefaultData = async () => {
    try {

        // Create default filters
        for (const [type, names] of Object.entries(defaultFilters)) {
            for (const name of names) {
                await Filter.findOrCreate({
                    where: { name, type },
                    defaults: {
                        name,
                        type,
                        created_by: "SYSTEM"
                    }
                });
            }
        }

        // Create default pipelines and their stages
        for (const pipelineData of defaultPipelines) {
            const [pipeline] = await Pipeline.findOrCreate({
                where: { name: pipelineData.name },
                defaults: {
                    name: pipelineData.name,
                    created_by: "SYSTEM"
                }
            });

            // Group stages by type to ensure proper ordering
            const stagesByType = {};
            pipelineData.stages.forEach(stage => {
                if (!stagesByType[stage.type]) {
                    stagesByType[stage.type] = [];
                }
                stagesByType[stage.type].push(stage);
            });

            // Create stages for each type
            for (const type in stagesByType) {
                const typeStages = stagesByType[type];
                for (let i = 0; i < typeStages.length; i++) {
                    const stageData = typeStages[i];
                    await Stage.findOrCreate({
                        where: {
                            name: stageData.name,
                            pipeline: pipeline.id,
                            type: stageData.type
                        },
                        defaults: {
                            ...stageData,
                            pipeline: pipeline.id,
                            created_by: "SYSTEM",
                            is_default: i === 0 // Only set first stage of each type as default
                        }
                    });
                }
            }
        }
    } catch (error) {
        console.error('❌ Error initializing default data:', error);
    }
};

export { initializeDefaultData }; 