package org.atg.bems.service;

import org.atg.bems.postgresql.entity.Client;
import org.atg.bems.postgresql.repository.ClientRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ClientService {
    private final ClientRepository clientRepository;

    public ClientService(ClientRepository clientRepository) {
        this.clientRepository = clientRepository;
    }

    public Client getClientById(Long clientId){
        return clientRepository.findById(clientId).get();
    }

    public Client updateTargetUsage(Long clientId, Double targetUsage){
        Optional<Client> result = clientRepository.findById(clientId);
        if(result.isEmpty())
            return null;
        Client client = result.get();
        client.setTargetUsage(targetUsage);
        return clientRepository.save(client);
    }

    public Client updateAnomalyCriteria(Long clientId, Double anomalyCriteria){
        Optional<Client> result = clientRepository.findById(clientId);
        if(result.isEmpty())
            return null;
        Client client = result.get();
        client.setAnomalyCriteria(anomalyCriteria);
        return clientRepository.save(client);
    }

    public Client updateDailyUsageBound(Long clientId, Double usageBound){
        Optional<Client> result = clientRepository.findById(clientId);
        if(result.isEmpty())
            return null;
        Client client = result.get();
        client.setDailyUsageBound(usageBound);
        return clientRepository.save(client);
    }

    public Client updateMonthlyUsageBound(Long clientId, Double usageBound){
        Optional<Client> result = clientRepository.findById(clientId);
        if(result.isEmpty())
            return null;
        Client client = result.get();
        client.setMonthlyUsageBound(usageBound);
        return clientRepository.save(client);
    }
}
