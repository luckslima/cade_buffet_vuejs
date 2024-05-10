const app = Vue.createApp({

    data() {
        return {
            buffets: [],
            selectedBuffet: null,
            searchQuery: ''
        }
    },

    async mounted() {
        await this.getBuffets();
    },

    methods: {

        async getBuffets() {
            let response = await fetch("http://localhost:3000/api/v1/buffets");
            this.buffets = await response.json();

        },

        async selectBuffet(buffetId) {
            const response = await fetch(`http://localhost:3000/api/v1/buffets/${buffetId}`);
            const buffetDetails = await response.json();

            if (response.ok) {
                const eventTypesResponse = await fetch(`http://localhost:3000/api/v1/buffets/${buffetId}/event_types`);
                if (eventTypesResponse.ok) {
                    buffetDetails.event_types = await eventTypesResponse.json();
                } else {
                    buffetDetails.event_types = [];
                }
            }

            this.selectedBuffet = buffetDetails;
        },

        async checkAvailability(eventTypeId) {
            const eventType = this.selectedBuffet.event_types.find(et => et.id === eventTypeId);
            if (eventType.date && eventType.guests) {
                const params = new URLSearchParams({
                    date: eventType.date,
                    guests: eventType.guests
                }).toString();
                const url = `http://localhost:3000/api/v1/buffets/${this.selectedBuffet.id}/event_types/${eventTypeId}/availability?${params}`;

                const response = await fetch(url);
                const availability = await response.json();
                if (response.ok) {
                    eventType.availability = availability;
                } else {
                    alert('Erro ao buscar disponibilidade: ' + availability.error);
                }
            } else {
                alert('Por favor, preencha todos os campos.');
            }
        }

    },

    computed: {
        buffetsResult() {
            if (this.searchQuery) {

                return this.buffets.filter(buffet => {

                    return buffet.brand_name.toLowerCase().includes(this.searchQuery.toLowerCase());

                });

            } else {
                return this.buffets;
            }
        }
    }

})

app.mount('#app');